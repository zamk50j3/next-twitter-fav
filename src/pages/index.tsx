import Head from "next/head";
import MainTable from "./components/MainTable";

function App() {
  return (
    <>
      <Head>
        <title>iine-app-handson</title>
      </Head>
      <div className="bg-blue-50 min-h-screen">
        <div className="container mx-auto">
          <header className="flex justify-center items-center text-3xl h-32 mx-5">
            いいねした画像を並べるサイト
          </header>
          <div className="flex justify-center">
            <MainTable />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;