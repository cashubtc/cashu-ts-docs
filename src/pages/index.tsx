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
      <main className="h-screen bg-gradient-to-tr from-fuchsia-800 to-purple-800 pt-8">
        <div className="container mx-auto px-4 h-full flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="text-white space-y-6">
              <div className="flex gap-4 items-center">
                <img
                  src={require("@site/static/img/tslogo.png").default}
                  className="w-12 h-12"
                />
                <h1 className="text-5xl font-extrabold">
                  cashu-ts
                </h1>
              </div>

              <div className="inline-block">
                <pre className="py-2 px-4 rounded bg-purple-900/70 border-2 border-purple-900">
                  <code className="text-purple-300">$ </code>
                  <code>npm i @cashu/cashu-ts</code>
                </pre>
              </div>

              <div className="flex gap-4">
                <a
                  className="px-6 py-3 bg-purple-900 hover:bg-purple-700 rounded-full text-white hover:no-underline hover:text-white font-medium"
                  href={docsLink}
                >
                  Getting Started
                </a>
              </div>
            </div>

            <div className="hidden lg:block text-white">
              <p className="text-2xl">
                Building Web & Node based Cashu apps has never been easier
              </p>
            </div>
          </div>

          <div className="mt-auto mb-8">
            <h2 className="text-white text-xl mb-4 opacity-70">
              Trusted by developers building amazing apps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-lg bg-purple-900/30 border border-purple-800/50 p-4 flex items-center justify-center hover:bg-purple-900/40 transition-all duration-300"
                >
                  <img 
                    src={require("@site/static/img/tslogo.png").default}
                    alt="TypeScript Logo"
                    className="w-12 h-12 opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
