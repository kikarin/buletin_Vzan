// src/components/AuthLayout.jsx
function AuthLayout({ title, children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
          {children}
        </div>
      </div>
    )
  }
  
  export default AuthLayout
  