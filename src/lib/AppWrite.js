import sdk from "node-appwrite";

export const client = new sdk.Client();
client
  .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
  .setProject(import.meta.env.APPWRITE_PROJECT_ID)
  .setKey(import.meta.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

export const getSessions = async () => {
  const sessions = await databases.listDocuments(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_SESSIONS_ID,
    [sdk.Query.orderDesc("$createdAt")]
  );
  return sessions.documents;
};

export const getSession = async (id) => {
  const session = await databases.listDocuments(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_SESSIONS_ID,
    [sdk.Query.equal("$id", id)]
  );
  return session.documents[0];
};

export const getCFPs = async (id) => {
  const cfp = await databases.listDocuments(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_CFP_ID,
    [sdk.Query.equal("SessionID", id), sdk.Query.orderDesc("SubmissionDate")]
  );
  return cfp.documents;
};

export const acceptCFP = async (id) => {
  const cfp = await databases.updateDocument(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_CFP_ID,
    id,
    { Accepted: true }
  );
  return cfp.documents;
};

export const createSession = async (title, asbstract) => {
  const session = await databases.createDocument(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_SESSIONS_ID,
    sdk.ID.unique(),
    { Title: title, Abstract: asbstract }
  );
  return session;
};

export const updateSession = async (sessionID, title, asbstract) => {
  const session = await databases.updateDocument(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_SESSIONS_ID,
    sessionID,
    { Title: title, Abstract: asbstract }
  );
  return session;
};

export const createCFP = async (
  sessionID,
  conference,
  conferenceDate,
  submissionDate,
  URL
) => {
  const cfp = await databases.createDocument(
    import.meta.env.APPWRITE_DB_ID,
    import.meta.env.APPWRITE_CFP_ID,
    sdk.ID.unique(),
    {
      SessionID: sessionID,
      Conference: conference,
      ConferenceDate: conferenceDate,
      Accepted: false,
      SubmissionDate: submissionDate,
      URL: URL,
    }
  );
  return cfp;
};
