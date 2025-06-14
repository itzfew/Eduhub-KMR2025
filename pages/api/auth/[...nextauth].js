import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { auth, db } from '../../../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        await setDoc(doc(db, 'users', user.id), {
          name: user.name,
          email: user.email,
          phoneNumber: profile.phone_number || '',
          createdAt: new Date(),
        });
      }
      return true;
    },
  },
});
