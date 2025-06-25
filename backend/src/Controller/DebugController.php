<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DebugController extends AbstractController
{
    #[Route('/debug', name: 'debug')]
    public function debug(): Response
    {
        return $this->render('debug.html.twig');
    }
} 