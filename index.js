const { ApolloServer, gql } = require('apollo-server');

const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ];

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Geo{
    lat:String
    lng:String
  }
  type Company{
    name:String
    catchPhrase:String
    bs:String
  }
  type Address{
    street:String
    suite:String
    city:String
    zipcode:String
    geo:Geo
  }

  type User{
      id: ID
      name: String
      username: String
      email: String
      address: Address
      phone: String
      website :String
      company: Company
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    usersList(offset:Int!,limit:Int!,username:String): [User]
  }
`;

const resolvers = {
    Query: {
      books: () => books,
      usersList:async(_source,args,{dataSources})=>{
        return dataSources.usersAPI.getUsersList(args.offset,args.limit,args.username)
      },
    },
  };







const { RESTDataSource } = require('apollo-datasource-rest');

class Users extends RESTDataSource{
    constructor(){
        super();
        this.baseURL = 'https://jsonplaceholder.typicode.com'
    }

    async getUsersList(start=0,limit=5,username=''){
        const data = await this.get('users',{
            _start:start,
            _limit:limit,
            ...username?{username}:undefined
        })
        return data;
    }

}


const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
          usersAPI: new Users(),
        };
    }, 
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});