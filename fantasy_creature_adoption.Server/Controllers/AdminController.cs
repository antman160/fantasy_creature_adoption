using fantasy_creature_adoption.Server.Data;
using fantasy_creature_adoption.Server.DTOs.Creature;
using fantasy_creature_adoption.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Controllers
{
    [ApiController]
    [Route("api/admin/creatures")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/creatures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreatureReadDto>>> GetAllCreatures()
        {
            var creatures = await _context.Creatures
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

        // POST:api/admin/creatures
        [HttpPost]
        public async Task<ActionResult<CreatureReadDto>> CreateCreature(CreatureUpsertDto dto)
        {
            var creature = new Creature
            {
                Name = dto.Name,
                Species = dto.Species,
                Description = dto.Description,
                Habitat = dto.Habitat,
                Temperament = dto.Temperament,
                Diet = dto.Diet,
                ImageUrl = dto.ImageUrl,
                IsAdopted = dto.IsAdopted
            };

            _context.Creatures.Add(creature);
            await _context.SaveChangesAsync();

            var result = new CreatureReadDto
            {
                Id = creature.Id,
                Name = creature.Name,
                Species = creature.Species,
                Description = creature.Description,
                Habitat = creature.Habitat,
                Temperament = creature.Temperament,
                Diet = creature.Diet,
                ImageUrl = creature.ImageUrl,
                IsAdopted = creature.IsAdopted
            };

            return CreatedAtAction(nameof(GetCreatureById), new { id = creature.Id }, result);
        }

        // GET: api/admin/creatures/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CreatureReadDto>> GetCreatureById(int id)
        {
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

            if (creature == null)
            {
                return NotFound(new { message = $"Creature with ID {id} was not found." });
            }

            return Ok(creature);
        }

        // PUT: api/admin/creatures/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CreatureReadDto>> UpdateCreature(int id, CreatureUpsertDto dto)
        {
            var creature = await _context.Creatures.FirstOrDefaultAsync(c => c.Id == id);

            if (creature == null)
            {
                return NotFound(new { message = $"Creatures with ID {id} was not found." });
            }

            creature.Name = dto.Name;
            creature.Species = dto.Species;
            creature.Description = dto.Description;
            creature.Habitat = dto.Habitat;
            creature.Temperament = dto.Temperament;
            creature.Diet = dto.Diet;
            creature.ImageUrl = dto.ImageUrl;
            creature.IsAdopted = dto.IsAdopted;

            await _context.SaveChangesAsync();

            var result = new CreatureReadDto
            {
                Id = creature.Id,
                Name = creature.Name,
                Species = creature.Species,
                Description = creature.Description,
                Habitat = creature.Habitat,
                Temperament = creature.Temperament,
                Diet = creature.Diet,
                ImageUrl = creature.ImageUrl,
                IsAdopted = creature.IsAdopted
            };

            return Ok(result);
        }

        // DELETE: api/admin/creatures/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreature(int id)
        {
            var creature = await _context.Creatures.FirstOrDefaultAsync(c => c.Id == id);

            if (creature == null)
            {
                return NotFound(new { message = $"Creature with ID {id} was not found." });
            }

            _context.Creatures.Remove(creature);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{creature.Name} was deleted successfully." });
        }
    }
}