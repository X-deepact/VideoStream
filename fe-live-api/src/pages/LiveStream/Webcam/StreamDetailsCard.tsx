import React from 'react';

export interface StreamInitializeResponse {
  id: number | null;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  broadcast_url: string | null;
  push_url: string | null;
}

const StreamDetailsCard: React.FC<{
  data: StreamInitializeResponse;
}> = ({ data }) => {
  return (
    <div>
      {data?.thumbnail_url && (
        <img
          src={data?.thumbnail_url}
          alt={data.title || 'Thumbnail'}
          className="w-full h-48 object-cover rounded-t"
        />
      )}
      <div className="pt-3">
        <h2 className="text-lg font-semibold">{data?.title || 'No Title'}</h2>
        <p className="text-sm text-gray-600 mt-2">
          {data?.description || 'No Description'}
        </p>
      </div>
    </div>
  );
};

export default StreamDetailsCard;
