import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
