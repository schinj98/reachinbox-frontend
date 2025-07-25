import { useEffect, useState } from "react";
import { type Email } from "./types/Email";
import { EmailCard } from "./components/EmailCard";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [query, setQuery] = useState("");

  const fetchEmails = async () => {
    const res = await fetch(`${BACKEND_URL}/api/emails/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accounts: [
          {
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            auth: {
              user: import.meta.env.VITE_EMAIL1_USER,
              pass: import.meta.env.VITE_EMAIL1_PASS
            }
          },
          {
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            auth: {
              user: import.meta.env.VITE_EMAIL2_USER,
              pass: import.meta.env.VITE_EMAIL2_PASS
            }
          }
        ]
      })
    });
    
  
    const data = await res.json();
    const allEmails: Email[] = data.emails;
  
    const sortedEmails = allEmails.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEmails(sortedEmails);
  };
  

  useEffect(() => {
    fetchEmails();

    const socket = io(BACKEND_URL);

    socket.on("new_email", (email: Email) => {
      setEmails((prev) => [email, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredEmails = emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(query.toLowerCase()) ||
      e.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Email Aggregator Dashboard</h1>

      <input
        type="text"
        placeholder="🔍 Search emails..."
        className="w-full px-4 py-2 mb-6 border rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredEmails.length > 0 ? (
        <EmailCard emails={filteredEmails} />
      ) : (
        <p className="text-gray-500">No emails found.</p>
      )}
    </div>
  );
}

export default App;
