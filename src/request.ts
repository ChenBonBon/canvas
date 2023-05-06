export const query = `
  subscription diagramEvent($input: DiagramEventInput!) {
    diagramEvent(input: $input) {
      __typename
      ... on ErrorPayload {
        id
        message
        __typename
      }
      ... on SubscribersUpdatedEventPayload {
        id
        subscribers {
          username
          __typename
        }
        __typename
      }
      ... on DiagramRefreshedEventPayload {
        id
        diagram
        __typename
      }
    }
  }
`;
