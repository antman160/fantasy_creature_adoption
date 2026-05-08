using fantasy_creature_adoption.Server.Data;
using fantasy_creature_adoption.Server.DTOs.Match;
using fantasy_creature_adoption.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MatchController : ControllerBase
    {
        // Database context used to read available creatures
        private readonly AppDbContext _context;

        public MatchController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/match
        // Takes questionnaire answers and returns ranked creature matches
        [HttpPost]
        public async Task<ActionResult<IEnumerable<MatchResultDto>>> GetMatches(MatchRequestDto dto)
        {
            // Only match against creatures that have not already been adopted
            var creatures = await _context.Creatures
                .Where(c => !c.IsAdopted)
                .ToListAsync();

            // Score each creature, then sort from best match to lowest match
            var results = creatures
                .Select(c => ScoreCreature(c, dto))
                .OrderByDescending(r => r.Score)
                .ThenBy(r => r.Name)
                .ToList();

            return Ok(results);
        }

        // Calculates a compatibility score for one creature based on the user's preferences
        private static MatchResultDto ScoreCreature(Creature creature, MatchRequestDto dto)
        {
            int score = 0;
            var reasons = new List<string>();

            // Give points if the creature matches the user's preferred species
            if (!string.IsNullOrWhiteSpace(dto.PreferredSpecies) &&
                string.Equals(creature.Species, dto.PreferredSpecies, StringComparison.OrdinalIgnoreCase))
            {
                score += 35;
                reasons.Add("Matches your preferred species");
            }

            // Give points if the creature matches the user's preferred temperament
            if (string.Equals(creature.Temperament, dto.PreferredTemperament, StringComparison.OrdinalIgnoreCase))
            {
                score += 30;
                reasons.Add("Matches your preferred temperament");
            }

            // Give points if the creature matches the user's preferred diet
            if (!string.IsNullOrWhiteSpace(dto.PreferredDiet) &&
                string.Equals(creature.Diet, dto.PreferredDiet, StringComparison.OrdinalIgnoreCase))
            {
                score += 15;
                reasons.Add("Matches your preferred diet");
            }

            // Give points if the creature's habitat fits the user's housing type
            if (HabitatMatches(dto.HousingType, creature.Habitat))
            {
                score += 20;
                reasons.Add("Fits your housing type");
            }

            // Return the final match result object
            return new MatchResultDto
            {
                CreatureId = creature.Id,
                Name = creature.Name,
                Species = creature.Species,
                Description = creature.Description,
                Habitat = creature.Habitat,
                Temperament = creature.Temperament,
                Diet = creature.Diet,
                ImageUrl = creature.ImageUrl,
                Score = score,
                Reasons = reasons
            };
        }

        // Checks whether the user's housing type is compatible with the creature's habitat
        private static bool HabitatMatches(string housingType, string habitat)
        {
            var h = habitat.ToLower();

            return housingType switch
            {
                "Apartment" => h.Contains("apartment") || h.Contains("indoor"),
                "House" => h.Contains("house") || h.Contains("home"),
                "Ranch" => h.Contains("ranch"),
                "Rural" => h.Contains("rural") || h.Contains("large property"),
                "QuietHome" => h.Contains("quiet"),
                "Aviary" => h.Contains("aviary"),
                _ => false
            };
        }
    }
}