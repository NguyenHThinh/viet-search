export interface Comments {
  results: Comment[];
  page: number;
  limit: number;
  reviewed: Comment;
  totalPage: number;
  totalResults: number;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  business: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  rating: number;
  comment: string;
  images: string[];
  updatedAt: string;
  createdAt: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
  images: string[];
}
