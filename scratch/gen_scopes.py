import json
import random

itc_map = {
    "ITC-BT-01": "Terminología y definiciones.",
    "ITC-BT-02": "Normas de referencia en el REBT.",
    "ITC-BT-03": "Instaladores autorizados y empresas instaladoras.",
    "ITC-BT-04": "Documentación, autorizaciones y puesta en servicio de las instalaciones.",
    "ITC-BT-05": "Verificaciones e inspecciones iniciales y periódicas.",
    "ITC-BT-06": "Redes aéreas para distribución en baja tensión.",
    "ITC-BT-07": "Redes subterráneas para distribución en baja tensión.",
    "ITC-BT-08": "Sistemas de conexión del neutro y de las masas (Regímenes de neutro).",
    "ITC-BT-09": "Instalaciones de alumbrado exterior.",
    "ITC-BT-10": "Previsión de cargas para suministros en baja tensión.",
    "ITC-BT-11": "Acometidas de redes de distribución.",
    "ITC-BT-12": "Esquemas de las instalaciones de enlace.",
    "ITC-BT-13": "Cajas Generales de Protección (CGP).",
    "ITC-BT-14": "Línea General de Alimentación (LGA).",
    "ITC-BT-15": "Derivaciones individuales.",
    "ITC-BT-16": "Contadores: Ubicación y sistemas de instalación.",
    "ITC-BT-17": "Dispositivos generales de mando y protección (DGMP).",
    "ITC-BT-18": "Instalaciones de puesta a tierra.",
    "ITC-BT-19": "Prescripciones generales para instalaciones interiores o receptoras.",
    "ITC-BT-20": "Sistemas de instalación en instalaciones interiores (Cables).",
    "ITC-BT-21": "Tubos y canales protectores en instalaciones interiores.",
    "ITC-BT-22": "Protección contra sobreintensidades (Sobrecargas y cortocircuitos).",
    "ITC-BT-23": "Protección contra sobretensiones transitorias y permanentes.",
    "ITC-BT-24": "Protección contra los choques eléctricos (Contactos directos e indirectos).",
    "ITC-BT-25": "Instalaciones en viviendas: Circuitos y grados de electrificación.",
    "ITC-BT-26": "Instalaciones en viviendas: Prescripciones generales de instalación.",
    "ITC-BT-27": "Instalaciones en locales que contienen una bañera o ducha.",
    "ITC-BT-28": "Instalaciones en locales de pública concurrencia.",
    "ITC-BT-29": "Instalaciones en locales con riesgo de incendio o explosión (ATEX).",
    "ITC-BT-30": "Locales de características especiales (Húmedos, mojados, corrosivos).",
    "ITC-BT-31": "Instalaciones en piscinas y fuentes.",
    "ITC-BT-32": "Instalaciones de máquinas de elevación y transporte (Ascensores).",
    "ITC-BT-33": "Instalaciones provisionales y temporales de obras.",
    "ITC-BT-34": "Instalaciones en ferias y stands.",
    "ITC-BT-35": "Establecimientos agrícolas y pecuarios.",
    "ITC-BT-36": "Instalaciones a muy baja tensión.",
    "ITC-BT-37": "Instalaciones a tensiones especiales.",
    "ITC-BT-38": "Quirófanos y salas de intervención.",
    "ITC-BT-39": "Cercas eléctricas para ganado.",
    "ITC-BT-40": "Instalaciones generadoras de baja tensión (Autoconsumo).",
    "ITC-BT-41": "Instalaciones en caravanas y parques de caravanas.",
    "ITC-BT-42": "Instalaciones en puertos y marinas para barcos de recreo.",
    "ITC-BT-43": "Prescripciones generales para la instalación de receptores.",
    "ITC-BT-44": "Receptores de alumbrado y rótulos luminosos.",
    "ITC-BT-45": "Aparatos de caldeo.",
    "ITC-BT-46": "Cables y folios radiantes en viviendas.",
    "ITC-BT-47": "Motores eléctricos.",
    "ITC-BT-48": "Transformadores, reactancias y condensadores.",
    "ITC-BT-49": "Instalaciones eléctricas en muebles.",
    "ITC-BT-50": "Locales con radiadores para saunas.",
    "ITC-BT-51": "Sistemas de automatización y gestión de la energía (Domótica).",
    "ITC-BT-52": "Infraestructura para la recarga de vehículos eléctricos."
}

questions = []
itc_list = list(itc_map.keys())

for itc_id, title in itc_map.items():
    # Pregunta 1: ¿Qué ITC se encarga de...?
    q1 = {
        "id": f"SCOPE-{itc_id}-01",
        "question": f"¿Qué Instrucción Técnica Complementaria (ITC) regula las {title.lower()}?",
        "options": [],
        "type": "simple"
    }
    
    # Pregunta 2: ¿De qué trata la ITC-BT-XX?
    q2 = {
        "id": f"SCOPE-{itc_id}-02",
        "question": f"¿Cuál es el objeto de estudio o regulación de la {itc_id}?",
        "options": [],
        "type": "simple"
    }
    
    # Distractores para q1
    distractors = random.sample([x for x in itc_list if x != itc_id], 3)
    choices1 = distractors + [itc_id]
    random.shuffle(choices1)
    for i, choice in enumerate(choices1):
        q1["options"].append({
            "id": i + 1,
            "answer": choice,
            "isCorrect": choice == itc_id,
            "explanation": f"La {itc_id} es la encargada de {title.lower()}" if choice == itc_id else f"La {choice} se encarga de {itc_map[choice].lower()}"
        })
    
    # Distractores para q2
    distractor_titles = random.sample([itc_map[x] for x in itc_list if x != itc_id], 3)
    choices2 = distractor_titles + [title]
    random.shuffle(choices2)
    for i, choice in enumerate(choices2):
        correct_itc = [k for k, v in itc_map.items() if v == choice][0]
        q2["options"].append({
            "id": i + 1,
            "answer": choice,
            "isCorrect": choice == title,
            "explanation": f"Correcto, la {itc_id} regula {title.lower()}" if choice == title else f"Esa es la función de la {correct_itc}"
        })
    
    questions.append(q1)
    questions.append(q2)

output_data = [
    {
        "id": "quiz-itc-bt-scopes",
        "itc": "REBT-SCOPES",
        "questions": questions
    }
]

with open('/home/thot/proyects/supera-bert/data/itc-bt-scopes.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"Generated {len(questions)} scope questions.")
