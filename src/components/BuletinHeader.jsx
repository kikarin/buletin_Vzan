import { Link } from 'react-router-dom';

function BuletinHeader({ userId, userName }) {
  return (
    <div className="my-4">
      <span className="text-gray-600 text-sm">Ditulis oleh: </span>
      <Link
        to={`/profile/${userId}`}
        className="text-blue-600 hover:underline text-sm"
      >
        {userName || 'Penulis'}
      </Link>
    </div>
  );
}

export default BuletinHeader;
