import Link from "next/link";
import { BookCardProps } from "@/types";
import Image from "next/image";

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article className="book-card">
        <figure className="book-card-figure">
          <div className="book-card-cover-wrapper">
            {coverURL ? (
              <Image
                src={coverURL}
                alt={title}
                width={133}
                height={200}
                className="book-card-cover"
              />
            ) : (
              <div className="book-card-cover flex h-[200px] w-[133px] items-center justify-center rounded-2xl border border-dashed border-[#cbbfa8] bg-[#f4ede0] px-3 text-center text-sm font-medium text-[#6d5f4b]">
                No cover available
              </div>
            )}
          </div>

          <figcaption className="book-card-meta">
            <h3 className="book-card-title">{title}</h3>
            <p className="book-card-author">{author}</p>
          </figcaption>
        </figure>
      </article>
    </Link>
  );
};
export default BookCard;
