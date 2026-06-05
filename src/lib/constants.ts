import { SportConfig, Sport } from './types'

export const SPORTS: Record<Sport, SportConfig> = {
  calcio: {
    nome: 'Calcio', icon: '⚽', foot: true, score: 'Reti', scoreOne: 'Rete', gk: 'Portiere', fed: 'FIGC',
    ruoli: ['Portiere','Terzino destro','Terzino sinistro','Difensore centrale','Mediano','Centrocampista centrale','Trequartista','Esterno offensivo','Seconda punta','Centravanti'],
    categorie: ['Terza Categoria','Seconda Categoria','Prima Categoria','Promozione','Eccellenza','Serie D'],
    abbr: {'Portiere':'GK','Terzino destro':'TD','Terzino sinistro':'TS','Difensore centrale':'DC','Mediano':'MED','Centrocampista centrale':'CC','Trequartista':'TRQ','Esterno offensivo':'EST','Seconda punta':'SP','Centravanti':'ATT'},
  },
  calcio5: {
    nome: 'Calcio a 5', icon: '🥅', foot: true, score: 'Reti', scoreOne: 'Rete', gk: 'Portiere', fed: 'FIGC',
    ruoli: ['Portiere','Difensore','Laterale','Pivot','Universale'],
    categorie: ['Serie D','Serie C2','Serie C1','Serie B','Serie A2'],
    abbr: {'Portiere':'POR','Difensore':'DIF','Laterale':'LAT','Pivot':'PIV','Universale':'UNI'},
  },
  pallavolo: {
    nome: 'Pallavolo', icon: '🏐', foot: false, score: 'Punti', scoreOne: 'Punto', gk: null, fed: 'FIPAV',
    ruoli: ['Palleggiatore','Opposto','Schiacciatore','Centrale','Libero'],
    categorie: ['Terza Divisione','Seconda Divisione','Prima Divisione','Serie D','Serie C','Serie B2','Serie B1'],
    abbr: {'Palleggiatore':'P','Opposto':'O','Schiacciatore':'S','Centrale':'C','Libero':'L'},
  },
  rugby: {
    nome: 'Rugby', icon: '🏉', foot: false, score: 'Mete', scoreOne: 'Meta', gk: null, fed: 'FIR',
    ruoli: ['Pilone','Tallonatore','Seconda linea','Flanker','Numero 8',"Mediano di mischia","Mediano d'apertura",'Centro','Ala','Estremo'],
    categorie: ['Serie C','Serie B','Serie A','Eccellenza'],
    abbr: {'Pilone':'PIL','Tallonatore':'TAL','Seconda linea':'2L','Flanker':'FL','Numero 8':'N8','Mediano di mischia':'MM',"Mediano d'apertura":'MA','Centro':'CEN','Ala':'ALA','Estremo':'EST'},
  },
  basket: {
    nome: 'Basket', icon: '🏀', foot: false, score: 'Punti', scoreOne: 'Punto', gk: null, fed: 'FIP',
    ruoli: ['Playmaker','Guardia','Ala','Ala Forte','Centro'],
    categorie: ['Serie D','Serie C Gold','Serie C Silver','Serie B','Serie A2','Serie A'],
    abbr: {'Playmaker':'PG','Guardia':'G','Ala':'A','Ala Forte':'AF','Centro':'C'},
  },
}

export const SPORT_KEYS = Object.keys(SPORTS) as Sport[]

export const STAFF_TYPES = [
  'Allenatore','Vice allenatore','Preparatore atletico','Preparatore dei portieri',
  'Massaggiatore / Fisioterapista','Team manager','Dirigente accompagnatore','Osservatore',
]

export const STAFF_CATEGORIE = [
  'U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
  'Juniores','Prima squadra','Tutte le categorie',
]

export const REGIONI = [
  'Abruzzo','Basilicata','Calabria','Campania','Emilia-Romagna','Friuli-Venezia Giulia',
  'Lazio','Liguria','Lombardia','Marche','Molise','Piemonte','Puglia','Sardegna',
  'Sicilia','Toscana','Trentino-Alto Adige','Umbria',"Valle d'Aosta",'Veneto',
]

export const ADMIN_EMAILS = ['calcio.levelup@gmail.com']
