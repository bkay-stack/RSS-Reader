export default function FooterLayout({
  Children,
}: {
  Children: React.ReactNode;
}) {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        &copy; {new Date().getFullYear()} My Website. All rights reserved.
      </div>
      {Children}
    </footer>
  );
}
