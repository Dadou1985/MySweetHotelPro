module.exports = {
  siteMetadata: {
    title: `IziShift`,
    description: `An optimized communication tool for hotel personal staff.`,
    author: `David Simba`,
    url: `https://izishift.com`
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
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/pen.png`, // This path is relative to the root of the site.
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
  ],
}
