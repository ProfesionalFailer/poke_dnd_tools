function getSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/refs/heads/master/portrait/${id ? id.toString().padStart(4, '0') : '0000'}/Normal.png`;
}

class StatUtils {
	static stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

	static atkTable = [
		{ min: 1, max: 5, bonus: -1 },
		{ min: 6, max: 10, bonus: 0 },
		{ min: 11, max: 25, bonus: 1 },
		{ min: 26, max: 45, bonus: 3 },
		{ min: 46, max: 70, bonus: 5 },
		{ min: 71, max: 100, bonus: 7 },
		{ min: 101, max: 140, bonus: 9 },
		{ min: 141, max: 180, bonus: 11 },
		{ min: 181, max: 230, bonus: 13 },
		{ min: 231, max: 299, bonus: 15 },
		{ min: 300, max: 349, bonus: 17 },
		{ min: 350, max: Infinity, bonus: 19 },
	];

	static defTable = [
		{ min: 1, max: 9, bonus: 0 },
		{ min: 10, max: 25, bonus: 1 },
		{ min: 26, max: 43, bonus: 2 },
		{ min: 44, max: 63, bonus: 3 },
		{ min: 64, max: 85, bonus: 4 },
		{ min: 86, max: 109, bonus: 5 },
		{ min: 110, max: 137, bonus: 6 },
		{ min: 138, max: 169, bonus: 7 },
		{ min: 170, max: 205, bonus: 8 },
		{ min: 206, max: 245, bonus: 9 },
		{ min: 246, max: 289, bonus: 10 },
		{ min: 290, max: Infinity, bonus: 11 },
	];

	static spdTable = [
		{ min: 1, max: 29, bonus: 0, tile: 3 },
		{ min: 30, max: 49, bonus: 1, tile: 4 },
		{ min: 50, max: 69, bonus: 2, tile: 6 },
		{ min: 70, max: 89, bonus: 3, tile: 7 },
		{ min: 90, max: 109, bonus: 4, tile: 8 },
		{ min: 110, max: 129, bonus: 5, tile: 9 },
		{ min: 130, max: 149, bonus: 6, tile: 10 },
		{ min: 150, max: 169, bonus: 7, tile: 11 },
		{ min: 170, max: 189, bonus: 8, tile: 12 },
		{ min: 190, max: 209, bonus: 9, tile: 13 },
		{ min: 210, max: 249, bonus: 10, tile: 14 },
		{ min: 250, max: Infinity, bonus: 11, tile: 15 },
	];

	static getTable(stat) {
		if (stat == 'atk' || stat == 'spa') return this.atkTable;
		if (stat == 'def' || stat == 'spd') return this.defTable;
		if (stat == 'spe') return this.spdTable;

		return null;
	}

	static nameCorrector(stat) {
		const names = { 'hp': 'hp', 'attack': 'atk', 'defense': 'def', 'special-attack': 'spa', 'special-defense': 'spd', 'speed': 'spe' };

		return names[stat] || stat;
	}
}

class TypeUtils {
  static typeMap = {
    normal: "normale",
    fire: "fuoco",
    water: "acqua",
    electric: "elettro",
    grass: "erba",
    ice: "ghiaccio",
    fighting: "lotta",
    poison: "veleno",
    ground: "terra",
    flying: "volante",
    psychic: "psico",
    bug: "coleottero",
    rock: "roccia",
    ghost: "spettro",
    dragon: "drago",
    dark: "buio",
    steel: "acciaio",
    fairy: "folletto"
  };

  static enToIt(type) {
    if (!type) return null;
    return this.typeMap[type.toLowerCase()] || null;
  }

  static itToEn(type) {
    if (!type) return null;

    const entry = Object.entries(this.typeMap).find(
      ([en, it]) => it === type.toLowerCase()
    );

    return entry ? entry[0] : null;
  }
}

class NatureUtils {
	static NATURES = [
		{ it: 'Allegra', en: 'Jolly', up: 'spe', down: 'spa' },
		{ it: 'Ardente', en: 'Rash', up: 'spa', down: 'spd' },
		{ it: 'Ardita', en: 'Hardy', up: null, down: null },
		{ it: 'Audace', en: 'Brave', up: 'atk', down: 'spe' },
		{ it: 'Birbona', en: 'Naughty', up: 'atk', down: 'spd' },
		{ it: 'Calma', en: 'Calm', up: 'spd', down: 'atk' },
		{ it: 'Cauta', en: 'Careful', up: 'spd', down: 'spa' },
		{ it: 'Decisa', en: 'Adamant', up: 'atk', down: 'spa' },
		{ it: 'Docile', en: 'Docile', up: null, down: null },
		{ it: 'Fiacca', en: 'Lax', up: 'def', down: 'spd' },
		{ it: 'Furba', en: 'Quirky', up: null, down: null },
		{ it: 'Gentile', en: 'Gentle', up: 'spd', down: 'def' },
		{ it: 'Ingenua', en: 'Naive', up: 'spe', down: 'spd' },
		{ it: 'Lesta', en: 'Hasty', up: 'spe', down: 'def' },
		{ it: 'Mite', en: 'Mild', up: 'spa', down: 'def' },
		{ it: 'Modesta', en: 'Modest', up: 'spa', down: 'atk' },
		{ it: 'Placida', en: 'Relaxed', up: 'def', down: 'spe' },
		{ it: 'Quieta', en: 'Quiet', up: 'spa', down: 'spe' },
		{ it: 'Ritrosa', en: 'Bashful', up: null, down: null },
		{ it: 'Scaltra', en: 'Impish', up: 'def', down: 'spa' },
		{ it: 'Schiva', en: 'Lonely', up: 'atk', down: 'def' },
		{ it: 'Seria', en: 'Serious', up: null, down: null },
		{ it: 'Sicura', en: 'Bold', up: 'def', down: 'atk' },
		{ it: 'Timida', en: 'Timid', up: 'spe', down: 'atk' },
		{ it: 'Vivace', en: 'Sassy', up: 'spd', down: 'spe' },
	];

	static itToNature = (() => {
		const map = new Map();
		for (const n of NatureUtils.NATURES) {
			map.set(n.it.toLowerCase(), n);
		}
		return map;
	})();

	static enToNature = (() => {
		const map = new Map();
		for (const n of NatureUtils.NATURES) {
			map.set(n.en.toLowerCase(), n);
		}
		return map;
	})();

	static engToIt(name) {
		return NatureUtils.enToNature.get(name.toLowerCase())?.it ?? null;
	}

	static itToEng(name) {
		return NatureUtils.itToNature.get(name.toLowerCase())?.en ?? null;
	}

	static getNature(name) {
		if (!name) return null;
		const key = name.toLowerCase();
		return NatureUtils.itToNature.get(key) || NatureUtils.enToNature.get(key) || null;
	}

	static checkValid(name) {
		if (!name) return false;

		return NatureUtils.getNature(name.toLowerCase()) !== null;
	}

	static getNatureMultiplier(natureName, stat) {
		if (natureName === null) return 1.0;

		const n = this.getNature(natureName.toLowerCase());

		if (!n) return null;

		if (n.up === stat.toLowerCase()) return 1.1;
		if (n.down === stat.toLowerCase()) return 0.9;

		return 1.0;
	}
}


class GrowthUtils {

	static formulas = {
		irregolare(lvl) {
			const l3 = Math.pow(lvl, 3);

			if (lvl < 50) return Math.floor((l3 * (100 - lvl)) / 50);
			if (lvl < 68) return Math.floor((l3 * (150 - lvl)) / 100);
			if (lvl < 98) return Math.floor((l3 * Math.floor((1911 - 10 * lvl) / 3)) / 500);
			return Math.floor((l3 * (160 - lvl)) / 100);
		},
		veloce: lvl => Math.floor((4 * lvl ** 3) / 5),

		"medio-veloce": lvl => lvl ** 3,

		"medio-lenta": lvl =>
			Math.floor(Math.floor(6 * (lvl ** 3) / 5) - (15 * (lvl ** 2)) + 100 * lvl - 140),

		lenta: lvl => Math.floor((5 * lvl ** 3) / 4),

		fluttuante(lvl) {
			const l3 = lvl ** 3;

			if (lvl < 15) return Math.floor(l3 * Math.floor((lvl + 1) / 3 + 24) / 50);
			if (lvl < 36) return Math.floor(l3 * (lvl + 14) / 50);

			return Math.floor(l3 * (Math.floor(lvl / 2) + 32) / 50);

		}
	}

	static nameCorrector(rate) {
		const rates = {'slow-then-very-fast': 'irregolare', 'fast' : 'veloce', 'medium': 'medio-lenta', 'medium-slow': 'medio-veloce', 'slow': 'lenta','fast-then-very-slow': 'fluttuante'};

		return rates[rate] || rate;
	}

	static getTotalXp(rate, lvl) {
		if (!Number.isInteger(lvl) || lvl < 1 || lvl > 100) throw new Error('Livello non valido (deve essere 1–100)');
		if (lvl == 1) return 0;

		const normalizedRate = rate.toLowerCase();
		const formula = this.formulas[normalizedRate];

		if (!formula) {
			throw new Error(`Tasso di crescita non valida: ${rate}`);
		}

		return formula(lvl);
	}

	static getXpToNext(rate, lvl) {
		if (lvl == 100) return 0;

		return this.getTotalXp(rate, lvl + 1) - this.getTotalXp(rate, lvl); 
	}

}


class Pokemon {
	id = null;
	name = null;
	type = [];

	base_xp = null;
	given_xp = null;

	total_xp = null;
	xp_to_level = null;
	current_xp = 0;

	base_stats = { hp: null, atk: null, def: null, spa: null, spd: null, spe: null };
	stats = { hp: null, atk: null, def: null, spa: null, spd: null, spe: null };
	dnd_stats = { hp: null, atk: null, def: null, spa: null, spd: null, spe: null };

	tile = null;

	constructor(level, nature = null) {
		if (level < 1 || level > 100) throw new Error('Livello non valido (deve essere 1–100)');
		
		this.level = level;

		if (nature !== null && !NatureUtils.checkValid(nature)) throw new Error('Natura non valida');

		this.nature = nature;
	}

	async init(name_id, xp=0) {
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name_id}`);
		const data = await res.json();

		this.id = data.id;
		this.name = data.name;
		this.type = data.types.map((x) => TypeUtils.enToIt(x.type.name.toLowerCase()));
		this.base_stats = Object.fromEntries(data.stats.map((x) => [StatUtils.nameCorrector(x.stat.name), x.base_stat]));
		this.base_xp = data.base_experience;

		const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${this.id}`);
		const data2 = await res2.json()

		this.growth_rate = GrowthUtils.nameCorrector(data2.growth_rate.name);

		this.levelUp(xp);
	}

	levelUp(xp_gain) {
		this.calculateXp();

		this.current_xp += xp_gain;

		while (this.current_xp >= this.xp_to_level) {
			this.level += 1;
			this.current_xp = this.current_xp - this.xp_to_level;
			this.calculateXp();

			if (this.level == 100) this.current_xp = 0;
		}

		this.calculateXp()
		this.calculateStats();
		this.calculateDNDStats();
	}

	calculateXp() {
		this.given_xp = Math.floor(2 * this.level * this.base_xp / 5);
		this.total_xp = GrowthUtils.getTotalXp(this.growth_rate, this.level);
		this.xp_to_level = GrowthUtils.getXpToNext(this.growth_rate, this.level);
	}

	calculateStats(IV=31, EV=0) {
		for (const stat in this.base_stats) {
			const statValue = this.base_stats[stat];

			if (stat == 'hp') {
				this.stats[stat] = Math.floor(((2 * statValue + IV + Math.floor(EV / 4)) * this.level) / 100) + this.level + 10;
				continue;
			}

			this.stats[stat] = Math.floor(
				(Math.floor(((2 * statValue + IV + Math.floor(EV / 4)) * this.level) / 100) + 5) * NatureUtils.getNatureMultiplier(this.nature, stat)
			);
		}
	}

	calculateDNDStats() {
		for (const stat in this.stats) {
			const statValue = this.stats[stat];

			if (stat == 'hp') {
				this.dnd_stats[stat] = Math.floor(Math.max(statValue * 0.70, statValue - 0.0214 * Math.pow(statValue, 1.49)));
				continue;
			}

			const bonusTable = StatUtils.getTable(stat);

			const entry = bonusTable.find((r) => statValue >= r.min && statValue <= r.max);

			this.dnd_stats[stat] = entry ? entry.bonus : 0;

			if (stat == 'spe' && entry) this.tile = entry.tile;
		}
	}

	

	static async create(name_id, level = 1, nature = null, xp = 0) {
		const p = new Pokemon(level, nature);
		await p.init(name_id, xp);
		return p;
	}
}

async function mainStuff() {
	const [, , name, levelArg, nature] = process.argv;

	if (!name) {
		console.log("Usage:");
		console.log("  node cli.js <pokemon-name> [level] [nature]");
		console.log("");
		console.log("Example:");
		console.log("  node cli.js pikachu 25 brave");
		process.exit(1);
	}

	const level = Number(levelArg) || 1;
		const pokemon = await Pokemon.create(name, level, nature);

		console.log("========================");
		console.log(`Nome   : ${pokemon.name}`);
		console.log(`ID     : ${pokemon.id}`);
		console.log(`Livello  : ${pokemon.level}`);
		console.log(`Natura : ${pokemon.nature || "None"}`);
		console.log(`Tipi  : ${pokemon.type.join(", ")}`);
		console.log(`Statistiche: ${JSON.stringify(pokemon.stats)}`);
		console.log(`Statistiche DND: ${JSON.stringify(pokemon.dnd_stats)}`);
		console.log(`Caselle per turno: ${pokemon.tile}`)
		console.log(`Tasso di crescita: ${pokemon.growth_rate}`);
		console.log(`Esperienza totale: ${pokemon.total_xp}`);
		console.log(`Esperienza a livello: ${pokemon.xp_to_level}`);
		console.log(`Esperienza ceduta alla sconfitta: ${pokemon.given_xp}`)
		console.log("========================");
}
