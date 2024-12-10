import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const docsLink = useBaseUrl("docs/Introduction/getting_started");
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main className="text-white grow bg-gradient-to-tr from-fuchsia-800 to-purple-800">
        <div className="flex flex-col items-center p-8 ">
          <div className="py-32 flex flex-col items-center justify-center text-center gap-8">
            <div className="flex gap-4">
              <img
                src={require("@site/static/img/tslogo.png").default}
                className="w-12 h-12"
              />
              <h1 className="text-5xl font-extrabold max-w-5xl text-center">
                cashu-ts
              </h1>
            </div>
            <p> Building Web & Node based Cashu apps has never been easier</p>
            <div className="flex gap-2 items-center justify-stretch">
              <pre className="py-2 px-4 rounded bg-purple-900/70 border-2 border-purple-900">
                <code className="text-purple-300">$ </code>
                <code>npm i @cashu/cashu-ts</code>
              </pre>
            </div>
            <div className="flex gap-4">
              <a
                className="px-4 py-2 bg-purple-900 hover:bg-purple-700 rounded-full border-none text-white hover:no-underline hover:text-white"
                href={docsLink}
              >
                Getting Started
              </a>
              {/* <a */}
              {/*   className="px-4 py-2 bg-purple-900 hover:bg-purple-700 rounded-full border-none text-white hover:no-underline hover:text-white" */}
              {/*   href="/docs/intro" */}
              {/* > */}
              {/*   See Examples */}
              {/* </a> */}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
