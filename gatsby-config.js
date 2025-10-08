require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const fs = require('fs')

// Conditionally include gatsby-firesource only if firebase.json exists
const hasFirebaseConfig = fs.existsSync(`${__dirname}/firebase.json`)

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
        path: `${__dirname}/src/images/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `My Sweet Hotel`,
        short_name: `My Sweet Hotel Pro`,
        start_url: `/`,
        background_color: `#630c13`,
        theme_color: `#630c13`,
        display: `standalone`,
        icon: `src/svg/mshPro-newLogo-transparent.png`, // This path is relative to the root of the site.
      },
    },
    ...(hasFirebaseConfig
      ? [{
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
        }]
      : []),
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
    // Enable Sentry only when SENTRY_DSN is provided
    ...(
      process.env.SENTRY_DSN
        ? [{
            resolve: "@sentry/gatsby",
            options: {
              dsn: process.env.GATSBY_SENTRY_DSN,
              release: process.env.GATSBY_SENTRY_RELEASE,
              sampleRate: 0.7,
            },
          }]
        : []
    ),
  ],
}
