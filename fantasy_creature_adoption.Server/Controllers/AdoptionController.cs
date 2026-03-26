using System.Security.Claims;
using fantasy_creature_adoption.Server.Data;
using fantasy_creature_adoption.Server.DTOs.Adoption;
using fantasy_creature_adoption.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace fantasy_creature_adoption.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdoptionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdoptionsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/adoptions/{creatureId}
        [Authorize]
        [HttpPost("{creatureId}")]
        public async Task<ActionResult<AdoptionResponseDto>> AdoptCreature(int creatureId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "User authentication information was missing." });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            var creature = await _context.Creatures.FirstOrDefaultAsync(c => c.Id == creatureId);

            if (creature == null)
            {
                return NotFound(new { message = $"Creature with ID {creatureId} was not found." });
            }

            if (creature.IsAdopted)
            {
                return BadRequest(new { message = "This creature is no longer available for adoption." });
            }

            var adoption = new Adoption
            {
                UserId = userId,
                CreatureId = creature.Id,
                AdoptedAt = DateTime.UtcNow
            };

            creature.IsAdopted = true;

            _context.Adoptions.Add(adoption);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new AdoptionResponseDto
            {
                AdoptionId = adoption.Id,
                CreatureId = creature.Id,
                CreatureName = creature.Name,
                Message = $"{creature.Name} was adopted successfully.",
                AdoptedAt = adoption.AdoptedAt
            });
        }

        // GET: api/adoptions/my
        [Authorize]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<MyAdoptionDto>>> GetMyAdoptions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "User authentication information was missing." });
            }

            var adoptions = await _context.Adoptions
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AdoptedAt)
                .Select(a => new MyAdoptionDto
                {
                    AdoptionId = a.Id,
                    CreatureId = a.CreatureId,
                    CreatureName = a.Creature != null ? a.Creature.Name : string.Empty,
                    Species = a.Creature != null ? a.Creature.Species : string.Empty,
                    ImageUrl = a.Creature != null ? a.Creature.ImageUrl : string.Empty,
                    AdoptedAt = a.AdoptedAt
                })
                .ToListAsync();

            return Ok(adoptions);
        }
    }
}