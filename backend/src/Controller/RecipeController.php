<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Attribute\DisableSession;

class RecipeController extends AbstractController
{
    #[Route('/recipes/extract-recipe-from-image', name: 'extract_recipe_from_image', methods: ['POST'])]
    #[DisableSession]
    public function extractRecipeFromImage(Request $request): JsonResponse
    {
        $image = $request->files->get('image');

        if (!$image) {
            return new JsonResponse(['error' => 'No image uploaded'], Response::HTTP_BAD_REQUEST);
        }

        if (!$image->isValid()) {
            return new JsonResponse(['error' => 'Invalid uploaded file'], Response::HTTP_BAD_REQUEST);
        }

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
        if (!in_array($image->getMimeType(), $allowedTypes)) {
            return new JsonResponse(['error' => 'Invalid file type. Only images are allowed.'], Response::HTTP_BAD_REQUEST);
        }

        $tmpPath = $image->getPathname();

        try {
            $text = (new TesseractOCR($tmpPath))->run();
            if (empty(trim($text))) {
                return new JsonResponse(['error' => 'No text could be extracted from the image'], Response::HTTP_BAD_REQUEST);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'OCR failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['text' => $text]);
    }
} 