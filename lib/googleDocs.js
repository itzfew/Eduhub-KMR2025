const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  scopes: ['https://www.googleapis.com/auth/documents.readonly'],
});

const docs = google.docs({ version: 'v1', auth });

export async function fetchBlogsFromGoogleDocs(docId) {
  try {
    const res = await docs.documents.get({ documentId: docId });
    const content = res.data.body.content
      .map(item => item.paragraph?.elements.map(el => el.textRun?.content).join(''))
      .join('\n');
    return { id: docId, content };
  } catch (error) {
    console.error('Error fetching Google Doc:', error);
    throw error;
  }
}
