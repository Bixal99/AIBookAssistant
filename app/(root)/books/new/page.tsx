import UploadForm from "@/components/UploadForm";
import { requireSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";

const Page = async () => {
    await requireSession(ROUTES.booksNew);

    return (
        <main className="new-book">
            <section className="flex flex-col gap-5 text-center">
                <h1 className="page-title-xl">Add a New Book</h1>
                <p className="subtitle">Upload a PDF to generate your  interactive reading experience</p>
            </section>

            <UploadForm />
        </main>
    )
}

export default Page
