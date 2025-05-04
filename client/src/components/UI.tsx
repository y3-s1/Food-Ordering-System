export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className="border p-2 w-full rounded-md" />;
  }
  
  export function Button({ children }: { children: React.ReactNode }) {
    return <button className="bg-blue-600 text-white px-4 py-2 rounded">{children}</button>;
  }
  