export type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  tags?: string;
  image_url?: string;
  status: number;
  created_at: string;
};

export type Tags = {
  id: number;
  title: string;
  rate: number;
};
