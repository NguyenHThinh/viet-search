export interface ContactForm {
  name: string;
  email: string;
  message: string;
  attachments?: {
    fallback: string;
    color: string;
    author_name: string;
    author_link: string;
    author_icon: string;
    title: string;
    title_link: string;
    text: string;
    ts: number;
  }[];
}
