from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Curso, Aula
from .serializers import SerializadorCurso, SerializadorListaCurso, SerializadorAula

class VisaoListaCursos(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, requisicao):
        cursos = Curso.objects.all()
        serializador = SerializadorListaCurso(
            cursos,
            many=True,
            context={'request': requisicao}
        )
        return Response(serializador.data)


class VisaoDetalheCurso(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, requisicao, pk):
        try:
            curso = Curso.objects.get(pk=pk)
            serializador = SerializadorCurso(curso, context={'request': requisicao})
            return Response(serializador.data)
        except Curso.DoesNotExist:
            return Response({'erro': 'Curso não encontrado'}, status=404)


class VisaoDetalheAula(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, requisicao, pk):
        try:
            aula = Aula.objects.get(pk=pk)
            serializador = SerializadorAula(aula)
            return Response(serializador.data)
        except Aula.DoesNotExist:
            return Response({'erro': 'Aula não encontrada'}, status=404)