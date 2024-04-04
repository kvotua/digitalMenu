import { CardCollection } from "src/entities/CardCollection/CardCollection";

const Home: React.FC = () => {
  return (
    <main className="container">
      <section className="columns-2 gap-5 max-[370px]:gap-2">
        <CardCollection id="1" image="/image.jpeg" />
        <CardCollection
          id="2"
          image="https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D"
        />
        <CardCollection
          id="2"
          image="https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D"
        />
        <CardCollection id="1" image="/image.jpeg" />
        <CardCollection id="1" image="/image.jpeg" />
        <CardCollection
          id="2"
          image="https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG98ZW58MHx8MHx8fDA%3D"
        />
      </section>
    </main>
  );
};

export { Home };
