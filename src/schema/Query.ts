import { gql } from "apollo-server";

const QuerySchema = gql`
  type Query {
    empty: String
  }
`;

export default QuerySchema;
