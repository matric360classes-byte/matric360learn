export default function Page({ params }: { params: { id: string } }) {
  return <div style={{padding:24}}>SUBJECT ID = {params.id} - ROUTE WORKS! Maths is back!</div>
}
