import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col">
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
            height={600}
            className="rounded-full object-cover"
            alt="Picture of the salon interior" />
        </div>
      </div>

      <div className="bg-slate-300 w-screen h-10" />

      <div className="flex flex-col m-10 gap-y-6">
        <h1 className="text-5xl font-medium text-slate-800">
          We offer treatments for...
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-300">
            <CardTitle className="flex ml-10 text-2xl">
              Hair
            </CardTitle>
            <CardContent>
              <Image
                src="/hair.jpg"
                alt="Picture of hair service"
                width={400}
                height={160}
                unoptimized
                className="w-full h-50 object-cover rounded-md"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-300">
            <CardTitle className="flex ml-10 text-2xl">
              Nails
            </CardTitle>
            <CardContent>
              <Image
                src="/nails.jpg"
                alt="Picture of nail service."
                width={400}
                height={160}
                unoptimized
                className="w-full h-50 object-cover rounded-md"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-300">
            <CardTitle className="flex ml-10 text-2xl">
              Brows
            </CardTitle>
            <CardContent>
              <Image
                src="/brows.jpg"
                alt="Picture of brows service"
                width={400}
                height={160}
                unoptimized
                className="w-full h-50 object-cover object-[60%_40%] rounded-md"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-300">
            <CardTitle className="flex ml-10 text-2xl">
              Lashes
            </CardTitle>
            <CardContent>
              <Image
                src="/lashes.jpg"
                alt="Picture of lashes service"
                width={400}
                height={160}
                unoptimized
                className="w-full h-50 object-cover rounded-md"
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}