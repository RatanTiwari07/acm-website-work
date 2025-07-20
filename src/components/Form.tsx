import { useState } from "react";
import { Upload, Send, Sparkles, CheckCircle } from "lucide-react";

export default function Form() {
  const [formData, setFormData] = useState({
    author: "",
    date: "",
    category: "",
    title: "",
    excerpt: "",
    content: "",
    // imageUrl: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dataToSend = {
      author: formData.author,
      date: formData.date,
      category: formData.category,
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      imageUrl: null,  // currrently null will be updated..
    };

    // local storage mein jo jwtToken store hoga login ke baad..
    const jwtToken = localStorage.getItem("jwtToken");

    console.log("Data to be sent:", dataToSend);
    console.log("JWT token:", jwtToken);

    try {
      const response = await fetch("http://localhost:8080/api/admin/add-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Form data submitted successfully:", result);

      setIsSubmitted(true);
      // Reset form after success message
      setTimeout(() => {
        setFormData({
          author: "",
          date: "",
          category: "",
          title: "",
          excerpt: "",
          content: "",
        });
        setImage(null); // Clear the image as well
        setIsSubmitted(false);
      }, 3000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-radial-gradient-light py-16 px-4">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#97CADB]/20 text-center animate-scaleIn">
            <div className="text-green-500 mb-4">
              <CheckCircle size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#001B48] mb-2">Success!</h2>
            <p className="text-[#02457A] mb-4">Your blog post has been submitted successfully.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-[#02457A] to-[#018ABE] h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-600">Redirecting you back to the form...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-radial-gradient-light py-16 px-4">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-[#97CADB]/20 animate-fade-in-up form-card-pattern">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#02457A] to-[#018ABE] text-white px-4 py-2 rounded-full mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Create Content</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gradient mb-2">Share Your Story</h1>
            <p className="text-[#02457A] text-lg leading-relaxed">Create and submit your blog post to our community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Author", name: "author", type: "text", icon: "👤", placeholder: "Your name" },
                { label: "Date", name: "date", type: "date", icon: "📅", placeholder: "" },
                { label: "Category", name: "category", type: "text", icon: "🏷️", placeholder: "e.g., Technology, Design" },
                { label: "Title", name: "title", type: "text", icon: "📝", placeholder: "Your blog title" },
              ].map((field) => (
                  <div key={field.name} className="group">
                    <label className="block font-semibold text-[#02457A] mb-2 group-hover:text-[#018ABE] transition-colors duration-300">
                      <span className="mr-2">{field.icon}</span>
                      {field.label}
                    </label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-[#97CADB]/30 rounded-xl focus:border-[#018ABE] focus:ring-2 focus:ring-[#018ABE]/20 outline-none transition-all duration-300 hover:border-[#018ABE]/50 bg-white/80 backdrop-blur-sm"
                        placeholder={field.placeholder}
                    />
                  </div>
              ))}
            </div>

            <div className="group">
              <label className="block font-semibold text-[#02457A] mb-2 group-hover:text-[#018ABE] transition-colors duration-300">
                <span className="mr-2">📸</span>
                Upload Image
              </label>
              <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    // Removed 'required' as the image is not being sent with this submission
                    className="w-full p-4 border border-[#97CADB]/30 rounded-xl focus:border-[#018ABE] focus:ring-2 focus:ring-[#018ABE]/20 outline-none transition-all duration-300 hover:border-[#018ABE]/50 bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D6EBEE] file:text-[#02457A] hover:file:bg-[#97CADB]"
                />
                <Upload size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#97CADB] pointer-events-none" />
              </div>
              {image && (
                  <p className="text-sm text-[#018ABE] mt-2 font-medium">
                    ✓ {image.name} selected (will be used later, not sent to backend now)
                  </p>
              )}
              {!image && (
                  <p className="text-sm text-gray-500 mt-2">
                    No image selected. `imageUrl` will be sent as `null`.
                  </p>
              )}
            </div>

            <div className="group">
              <label className="block font-semibold text-[#02457A] mb-2 group-hover:text-[#018ABE] transition-colors duration-300">
                <span className="mr-2">💭</span>
                Excerpt
              </label>
              <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-[#97CADB]/30 rounded-xl focus:border-[#018ABE] focus:ring-2 focus:ring-[#018ABE]/20 outline-none transition-all duration-300 hover:border-[#018ABE]/50 bg-white/80 backdrop-blur-sm"
                  placeholder="A brief summary of your article"
              />
            </div>

            <div className="group">
              <label className="block font-semibold text-[#02457A] mb-2 group-hover:text-[#018ABE] transition-colors duration-300">
                <span className="mr-2">📄</span>
                Content
              </label>
              <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  required
                  className="w-full p-4 border border-[#97CADB]/30 rounded-xl focus:border-[#018ABE] focus:ring-2 focus:ring-[#018ABE]/20 outline-none transition-all duration-300 hover:border-[#018ABE]/50 resize-none bg-white/80 backdrop-blur-sm custom-scrollbar"
                  placeholder="Write your blog content here... Share your insights, experiences, and knowledge with the community."
              />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </>
              ) : (
                  <>
                    <Send size={20} />
                    <span>Publish Article</span>
                  </>
              )}
            </button>
          </form>
        </div>
      </div>
  );
}