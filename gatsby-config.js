module.exports = {
  siteMetadata: {
    title: `My Sweet Hotel Pro`,
    description: `An optimized communication tool for hotel personal staff.`,
    author: `David Simba`,
    url: `mysweethotelpro.com`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `My Sweet Hotel`,
        short_name: `My Sweet Hotel Pro`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `standalone`,
        icon: `src/svg/mshPro-newLogo-transparent.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-firesource',
      options: {
        credential: require("./firebase.json"),
        types: [
          {
            type: 'Book',
            collection: 'books',
            map: doc => ({
              title: doc.title,
              isbn: doc.isbn,
              author___NODE: doc.author.id,
            }),
          },
          {
            type: 'Author',
            collection: 'authors',
            map: doc => ({
              name: doc.name,
              country: doc.country,
              books___NODE: doc.books.map(book => book.id),
            }),
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `limelight`,
          `source sans pro\:300,400,400i,700`,
          `Rock Salt`,
          `Swanky and Moo Moo`,
          `League Script`,
          `Miniver`,
          `Sedgwick Ave Display`,
          `Charmonman`,
          `Ruthie`,
          `Meie Script`,
          `Dr Sugiyama`,
          `Holtwood One SC`,
          `Bungee Inline`,
          `Averia Libre`,
          `Frijole`,
          `Faster One`,
          `Codystar`,
          `Homemade Apple`,
          `Reenie Beanie`,
          `Raleway Dots`,
          `Coiny`,
          `Monofett`
        ],
        display: 'swap'
      }
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: "https://1a9f3c36b4664949b6e9ef27b2182905@o1024943.ingest.sentry.io/5992588",
        sampleRate: 0.7,
      },
    },
  ],
}
