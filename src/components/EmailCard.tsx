import { type Email } from "../types/Email";
import { useState } from "react";

interface EmailCardProps {
  emails: Email[]; // Changed to accept array of emails
}

export const EmailCard = ({ emails }: EmailCardProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'work': 'bg-blue-100 text-blue-800',
      'personal': 'bg-green-100 text-green-800',
      'promotional': 'bg-purple-100 text-purple-800',
      'social': 'bg-orange-100 text-orange-800',
      'updates': 'bg-gray-100 text-gray-800',
      'default': 'bg-slate-100 text-slate-800'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateText = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - All Emails List */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          Inbox ({emails?.length || 0})
        </h2>

        </div>

        {/* Email List - All Emails */}
        <div className="flex-1 overflow-y-auto">
          {emails.map((email, index) => (
            <div 
              key={email.id || index}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              {/* Sender and Date */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {email.from?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {email.from || 'Unknown Sender'}
                    </p>
                  </div>
                </div>
                <time className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatDate(email.date)}
                </time>
              </div>

              {/* Subject */}
              <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                {email.subject || 'No Subject'}
              </h3>

              {/* Preview */}
              <p className="text-sm text-gray-600 truncate mb-2">
                {email.preview || 'No preview available'}
              </p>

              {/* Category Badge */}
              <span className={`
                inline-flex items-center px-2 py-1 text-xs font-medium rounded-full
                ${getCategoryColor(email.category)}
              `}>
                {email.category || 'uncategorized' }
              </span>
            </div>
          ))}
          
          {/* Empty State */}
          {emails.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No emails</h3>
              <p className="text-gray-500">Your inbox is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Selected Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedEmail.from?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEmail.from || 'Unknown Sender'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedEmail.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-xl font-semibold px-10 text-gray-900 mb-2">
                    {selectedEmail.subject || 'No Subject'}
                  </h1>
                </div>
                <span className={`
                  inline-flex items-center px-3 py-1 text-sm font-medium rounded-full
                  ${getCategoryColor(selectedEmail.category)}
                `}>
                  {selectedEmail.category || 'uncategorized'}
                </span>
                
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 p-6 bg-white overflow-y-auto">
              <div
                className="prose max-w-none text-gray-800 leading-relaxed mx-auto"
                dangerouslySetInnerHTML={{
                  __html: selectedEmail.description || '<p>No content available</p>',
                }}
              />
            </div>
          </>
        ) : (
          /* No Email Selected State */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email selected</h3>
              <p className="text-gray-500">Select an email from the list to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};