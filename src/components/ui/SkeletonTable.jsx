export function TableSkeleton() {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} animate-pulse`}>
            <td className="px-6 py-4">
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-1/2 rounded bg-gray-300"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-1/4 rounded bg-gray-300"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-1/3 rounded bg-gray-300"></div>
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
              </div>
            </td>
          </tr>
        ))}
      </>
    )
  }