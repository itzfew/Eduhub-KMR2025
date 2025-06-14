import { fetchBlogsFromGoogleDocs } from '../../../lib/googleDocs';

export default async function handler(req, res) {
  const { docId } = req.query;

  if (req.method === 'GET') {
    try {
      const blog = await fetchBlogsFromGoogleDocs(docId);
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog content' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
