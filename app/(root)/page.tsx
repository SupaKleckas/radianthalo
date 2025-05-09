import Image from "next/image";
import Link from "next/link";
import Message from "@/app/components/Notifications/Message";

export type paramsType = Promise<{
  status?: string
}>;

export default async function Page(props: { params: paramsType }) {
  const { status } = await props.params;

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
            <div className="hover:scale-105 transition">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Hair
              </h1>
              <Image
                src="/hair.jpg"
                alt="Picture of hair service"
                width={500}
                height={200}
                quality={100}
                className="w-full h-50 object-cover rounded-md"
              />
            </div>
          </Link>
          <Link href="/services?category=Nails">
            <div className="hover:scale-105 transition">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Nails
              </h1>
              <Image
                src="/nails.jpg"
                alt="Picture of nail service."
                width={500}
                height={200}
                quality={100}
                className="w-full h-50 object-cover rounded-md"
              />
            </div>
          </Link>
          <Link href="/services?category=Brows">
            <div className="hover:scale-105 transition">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Brows
              </h1>
              <Image
                src="/brows.jpg"
                alt="Picture of brows service"
                width={500}
                height={200}
                quality={100}
                className="w-full h-50 object-cover object-[60%_40%] rounded-md"
              />
            </div>
          </Link>
          <Link href="/services?category=Lashes">
            <div className="hover:scale-105 transition">
              <h1 className="flex font-bold text-3xl text-slate-800 m-6">
                Lashes
              </h1>
              <Image
                src="/lashes.jpg"
                alt="Picture of lashes service"
                width={500}
                height={200}
                quality={100}
                className="w-full h-50 object-cover rounded-md"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}