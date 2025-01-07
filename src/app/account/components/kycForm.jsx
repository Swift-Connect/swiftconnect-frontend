export default function KYCForm({ title, fields, onSubmit }) {
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
                {fields.map((field, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-600">{field.label}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}