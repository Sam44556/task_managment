import TrelloBoard from "../components/TaskBoard ";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TrelloBoard />
      <Footer />
    </div>
  );
};
export default Home;
