import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
	const data = await auth();
	return (
		<section>
			<code className="text-sm prose">
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</code>
		</section>
	);
}
