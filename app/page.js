import HomeClient from '@/Components/HomeClient'

export async function generateStaticParams() {
  return [{ id: "home" }]; // static params for homepage
}

export default function Homepage() {
  return <HomeClient />
}