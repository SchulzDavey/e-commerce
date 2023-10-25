import { getServerSession } from 'next-auth/next';
import authOptions from './api/auth/[...nextauth]/authOptions';
import NavBar from './components/NavBar';
import './globals.css';
import Hydrate from './components/Hydrate';
import { Roboto, Lobster_Two } from 'next/font/google';

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });

export const metadata = {
  title: 'Shop the latest trends',
  description:
    'Discover a wide selection of products on our online store. Find great deals and exclusive offers. Shop now',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`mx-4 lg:mx-48 ${roboto.className}`}>
        <Hydrate>
          <NavBar user={session?.user} expires={session?.expires as string} />
          {children}
        </Hydrate>
      </body>
    </html>
  );
}
