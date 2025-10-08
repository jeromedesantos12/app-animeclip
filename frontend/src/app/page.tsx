import { Protected } from "@/middleware/protected";

export default function HomePage() {
  // const router = useRouter();

  return (
    <Protected>
      <h1> Halo</h1>
    </Protected>
  );
}
