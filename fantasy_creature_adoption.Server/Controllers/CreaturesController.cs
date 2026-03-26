using fantasy_creature_adoption.Server.Data;
using fantasy_creature_adoption.Server.DTOs.Creature;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreaturesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CreaturesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/creatures
        // Returns all creatures, with optional filters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreatureReadDto>>> GetCreatures(
            [FromQuery] string? search,
            [FromQuery] string? species,
            [FromQuery] string? temperament,
            [FromQuery] string? diet,
            [FromQuery] bool availableOnly = false)
        {
            var query = _context.Creatures.AsQueryable();

            // Search by name, species, description, or habitat
            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();

                query = query.Where(c =>
                    c.Name.ToLower().Contains(term) ||
                    c.Species.ToLower().Contains(term) ||
                    c.Description.ToLower().Contains(term) ||
                    c.Habitat.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(species))
            {
                var speciesTerm = species.Trim().ToLower();
                query = query.Where(c => c.Species.ToLower() == speciesTerm);
            }

            if (!string.IsNullOrWhiteSpace(temperament))
            {
                var temperamentTerm = temperament.Trim().ToLower();
                query = query.Where(c => c.Temperament.ToLower() == temperamentTerm);
            }

            if (!string.IsNullOrWhiteSpace(diet))
            {
                var dietTerm = diet.Trim().ToLower();
                query = query.Where(c => c.Diet.ToLower() == dietTerm);
            }

            if (availableOnly)
            {
                query = query.Where(c => !c.IsAdopted);
            }

            // Convert database records into DTOs for the API response
            var creatures = await query
                .OrderBy(c => c.Name)
                .Select(c => new CreatureReadDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Species = c.Species,
                    Description = c.Description,
                    Habitat = c.Habitat,
                    Temperament = c.Temperament,
                    Diet = c.Diet,
                    ImageUrl = c.ImageUrl,
                    IsAdopted = c.IsAdopted
                })
                .ToListAsync();

            return Ok(creatures);
        }

        // GET: api/creatures/{id}
        // Returns one creature by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CreatureReadDto>> GetCreatureById(int id)
        {
            // Find the creature and convert it into a DTO
            var creature = await _context.Creatures
                .Where(c => c.Id == id)
                .Select(c => new CreatureReadDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Species = c.Species,
                    Description = c.Description,
                    Habitat = c.Habitat,
                    Temperament = c.Temperament,
                    Diet = c.Diet,
                    ImageUrl = c.ImageUrl,
                    IsAdopted = c.IsAdopted
                })
                .FirstOrDefaultAsync();

            // Return 404 if the creature does not exist
            if (creature == null)
            {
                return NotFound(new { message = $"Creature with ID {id} was not found." });
            }

            return Ok(creature);
        }
    }
}