<?php

namespace App\Services;

use Cloudinary\Cloudinary;

class CloudinaryService
{
  private $cloudinary;

  public function __construct()
  {
    $this->cloudinary = new Cloudinary([
      'cloud' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key' => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
      ]
    ]);
  }

  public function uploadImage($file, $folder = 'monomemo')
  {
    $result = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
      'folder' => $folder,
      'transformation' => [
        'width' => 800,
        'height' => 600,
        'crop' => 'limit',
        'quality' => 'auto'
      ]
    ]);

    return [
      'url' => $result['secure_url'],
      'public_id' => $result['public_id']
    ];
  }

  public function deleteImage($publicId)
  {
    return $this->cloudinary->uploadApi()->destroy($publicId);
  }
}
