"use server";

import { db } from "@/lib/db";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SqliteError } from "better-sqlite3";

import type { DatabaseUser } from "@/lib/db";
import type { ActionResult } from "@/lib/form";
import { generateId } from "lucia";
import {
  FormState,
  SignInFormSchema,
  SignUpFormSchema,
} from "@/lib/definition";

/* signUp */

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignUpFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateId(15);

  try {
    db.prepare(
      "INSERT INTO user (id, username, email, password_hash) VALUES(?, ?, ?, ?)"
    ).run(userId, username, email, passwordHash);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        message: "Username already used",
      };
    }
    return {
      message: "An unknown error occurred",
    };
  }
  return redirect("/");
}

/* signIn */

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignInFormSchema.safeParse({
    // username: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = db
    .prepare("SELECT * FROM user WHERE email = ?")
    .get(email) as DatabaseUser | undefined;
  if (!existingUser) {
    return {
      message: "Incorrect username or password",
    };
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
    // If usernames are public, you can outright tell the user that the username is invalid.
    return {
      message: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/dashboard");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
