import FeedHeader from "./FeedHeader";
import NewItemsBanner from "./NewItemsBanner";

export default function Feed() {
  return (
    <section className="flex flex-1 flex-col  mx-auto w-full ">
      <FeedHeader />
      <NewItemsBanner />
    </section>
  );
}
