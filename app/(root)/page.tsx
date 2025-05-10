import Image from "next/image";
import Link from "next/link";
import Message from "@/app/components/Notifications/Message";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
  const { status } = await props.searchParams;

  return (
    <div className="flex flex-col">
      {status == "signup-success" ? <Message type="success" message="You have been successfully registered in our system! Please login to your account." /> : null}
      {status == "signup-success-noemail" ? <Message type="success" message="You have been successfully registered in our system! Please login to your account. 
      However, the confirmation email could not be sent. Please verify your email address later." /> : null}
      <div className="flex flex-row justify-center md:justify-between m-10 gap-y-6">
        <div className="flex flex-col gap-y-6">
          <h1 className="text-6xl font-bold text-slate-800">
            Why wait? Book with us now!
          </h1>
          <h1 className="text-2xl text-slate-500">
            We promise the best results with a comfortable and genuine experience.
          </h1>
        </div>

        <div className="hidden md:flex mr-[8%]">
          <Image
            src={"/salon-interior.jpg"}
            width={600}
            height={400}
            placeholder="empty"
            className="rounded-2xl object-cover"
            alt="Picture of the salon interior" />
        </div>
      </div>

      <div className="bg-slate-300 w-full h-10" />

      <div className="flex flex-col m-10 gap-y-6">
        <h1 className="text-5xl font-medium text-slate-800">
          We offer treatments for...
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/services?category=Hair">
            <div className="hover:scale-105 transition overflow-hidden rounded-md">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Hair
              </h1>
              <div className="aspect-16/6 w-full relative">
                <Image
                  src="/hair.jpg"
                  alt="Picture of hair service"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </Link>
          <Link href="/services?category=Nails">
            <div className="hover:scale-105 transition overflow-hidden rounded-md">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Nails
              </h1>
              <div className="aspect-16/6 w-full relative">
                <Image
                  src="/nails.jpg"
                  alt="Picture of nail service."
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </Link>
          <Link href="/services?category=Brows">
            <div className="hover:scale-105 transition overflow-hidden rounded-md">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Brows
              </h1>
              <div className="aspect-16/6 w-full relative">
                <Image
                  src="/brows.jpg"
                  alt="Picture of brows service"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </Link>
          <Link href="/services?category=Lashes">
            <div className="hover:scale-105 transition overflow-hidden rounded-md">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Lashes
              </h1>
              <div className="aspect-16/6 w-full relative">
                <Image
                  src="/lashes.jpg"
                  alt="Picture of lashes service"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}