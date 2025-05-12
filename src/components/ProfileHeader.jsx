import React from 'react';

const ProfileHeader = ({
  previewImage,
  uploading,
  error,
  onImageChange,
}) => {
  return (
    <div className="relative w-full text-center">
      {/* Header / Cover */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl" />

      {/* Avatar */}
      <div className="relative z-10 -mt-4 flex justify-center">
        <div className="relative w-28 h-28 mt-2 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Edit Button (moved out, clearer placement) */}
        <label
          htmlFor="avatar-upload"
          className="absolute -bottom-0 right-[calc(50%-56px)] bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
          title="Ganti Foto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          disabled={uploading}
        />
      </div>


      {uploading && (
        <p className="text-xs text-center text-gray-500 mt-2">Mengupload gambar...</p>
      )}
      {error && (
        <p className="text-xs text-center text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default ProfileHeader;
