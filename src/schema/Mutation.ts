import { gql } from "apollo-server";

const MutationSchema = gql`
  type Mutation {
    empty: String
  }
`;

export default MutationSchema;
